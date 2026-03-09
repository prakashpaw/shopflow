output "manager_public_ip" {
  description = "Public IP addresses matches manager node"
  value       = aws_instance.swarm_manager.public_ip
}
